import { enums, guid, log, is, random } from '@piasastudios/core/shared';
import { db, web } from '@piasastudios/core/server';
import { File } from '@piasastudios/rogue/server/db';
import { FileStorage, GroupType } from '@piasastudios/rogue/shared';
import { attr, Context } from '@piasastudios/rogue/server/web';
import { FileRouter } from '@piasastudios/rogue/server/route/file';
import { Course, Nine, Design } from '../db';
import { COURSE_PHOTO_LIMIT, ERROR_CODES, CourseType, DesignState, xCoordinates } from '../../shared';
import { BaseRouter } from './base';

@web.attr.router( '/api/golf/course' )
export class CourseRouter extends BaseRouter {

    @web.attr.post.root()
    @attr.group( GroupType.User )
    public static async onCreate( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const course = cxt.params.get<Course>( 'course' );
        if( is.not.ok( course ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_INVALID, `golf: invalid course argument` );
        } else if( is.not.withChar( course?.name ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_INVALID_NAME, `golf: invalid course name argument` );
        } else if( is.not.withChar( course?.placeId ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_INVALID_PLACE, `golf: invalid course place argument` );
        } else if( !xCoordinates.isValid( course?.coordinate ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_INVALID_COORDINATE, `golf: invalid course coordinate argument` );
        } else if( !enums.isValue( CourseType, course.type ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_INVALID_TYPE, `golf: invalid course type argument` );
        }

        const exists = await new db.Query<Course>( Course.kind )
            .equal( 'placeId', course.placeId )
            .equal( 'type', course.type )
            .notEqual( 'hidden', true )
            .notEqual( 'disabled', true )
            .selectOne();

        if( is.ok( exists ) ) {
            log.warn( `golf: course already exists '${exists.id}'` );
            return exists;
        }

        return new db.Query<Course>( Course.kind )
            .on( 'beforeinsert', Context.onBeforeEdit( cxt ) )
            .insertOne( course );
    }

    @web.attr.get( '/featured-photo' )
    @attr.group( GroupType.Guest )
    public static async onFetchRandomFeaturedPhoto( _cxt: Context ): Promise<File> {
        const count = await new db.Query<File>( File.kind )
            .equal( 'ownerKind', Course.kind )
            .in( 'tags', ['photo-featured'] )
            .count();

        if( count <= 0 ) {
            throw new ApplicationError( ERROR_CODES.PHOTO_NOT_FOUND );
        }

        const randomStart = random.integer( 0, count )

        return new db.Query<File>( File.kind )
            .equal( 'ownerKind', Course.kind )
            .in( 'tags', ['photo-featured'] )
            .start( randomStart )
            .limit( 1 )
            .selectOne();
    }

    @web.attr.get( '/featured-photo/:key' )
    @attr.group( GroupType.Guest )
    @web.attr.argument( 'key', is.guid )
    public static async onFetchFeaturedPhoto( cxt: Context ): Promise<File> {
        const photoId = cxt.params.get( 'key' );
        const count = await new db.Query<File>( File.kind )
            .equal( '_id', photoId )
            .equal( 'ownerKind', Course.kind )
            .in( 'tags', ['photo-featured'] )
            .count();

        if( count !== 1 ) {
            throw new ApplicationError( ERROR_CODES.PHOTO_NOT_FOUND );
        }

        return FileRouter.onDownload( cxt );
    }

    @web.attr.put( '/:courseId' )
    @web.attr.argument( 'courseId', is.guid )
    @attr.group( GroupType.User )
    public static async onUpdate( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const updates = cxt.params.get<Course>( 'course' );
        const courseId = cxt.params.get<Guid>( 'courseId' );

        const course = await new db.Query<Course>( Course.kind )
            .on( 'beforeupdate', Context.onBeforeEdit( cxt ) )
            .equal( '_id', courseId )
            .updateOne( updates );

        if( is.not.ok( course ) ) {
            throw new ApplicationError( ERROR_CODES.COURSE_NOT_FOUND, `golf: invalid course '${courseId}'` );
        }

        return course;
    }

    @web.attr.get( '/:courseId' )
    @web.attr.argument( 'courseId', value => is.guid( value ) )
    @attr.group( GroupType.User )
    public static async onFetch( cxt: Context ): Promise<Course> {
        const courseId = cxt.params.get<Guid>( 'courseId' );

        return new db.Query<Course>( Course.kind ).equal( '_id', courseId ).selectOne();
    }

    @web.attr.get( '/place/:placeId' )
    @web.attr.argument( 'placeId', value => is.withChar( value ) )
    @web.attr.argument( 'type', value => enums.isValue( CourseType, value ) )
    @attr.group( GroupType.User )
    public static async onFetchByPlaceId( cxt: Context ): Promise<Course> {
        const placeId = cxt.params.get<string>( 'placeId' );
        const type = cxt.params.get<CourseType>( 'type' );

        return new db.Query<Course>( Course.kind )
            .equal( 'placeId', placeId )
            .equal( 'type', type )
            .notEqual( 'hidden', true )
            .notEqual( 'disabled', true )
            .selectOne();
    }

    @web.attr.post( '/:courseId/nine' )
    @web.attr.argument( 'courseId', value => is.guid( value ) )
    @web.attr.argument( 'nine', value => is.withChar( value?.name ) )
    @attr.group( GroupType.User )
    public static async onCreateNine( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const courseId = cxt.params.get<Guid>( 'courseId' );
        const nine = cxt.params.get<Nine>( 'nine' );

        const course = await this.loadCourse( courseId );

        if( is.not.array( course.nines ) ) {
            course.nines = [];
        }

        course.nines.push( {
            key: guid.create(),
            ...nine,
        } );

        this.sortNines( course );
        this.updateAuditInfo( cxt, course );
        return course.save();
    }

    @web.attr.put( '/:courseId/nine/:nineKey' )
    @web.attr.argument( 'courseId', is.guid )
    @web.attr.argument( 'nineKey', is.guid )
    @web.attr.argument( 'nine', value => is.withChar( value?.name ) )
    @attr.group( GroupType.User )
    public static async onUpdateNine( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const courseId = cxt.params.get<Guid>( 'courseId' );
        const nineKey = cxt.params.get<Guid>( 'nineKey' );
        const nine = cxt.params.get<Nine>( 'nine' );

        const course = await this.loadCourse( courseId );
        const found = this.findNine( course, nineKey );
        found.name = nine.name;

        this.sortNines( course );
        this.updateAuditInfo( cxt, course );
        return course.save();
    }

    @web.attr.del( '/:courseId/nine/:nineKey' )
    @web.attr.argument( 'courseId', value => is.guid( value ) )
    @web.attr.argument( 'nineKey', value => is.guid( value ) )
    @attr.group( GroupType.User )
    public static async onDeleteNine( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const courseId = cxt.params.get<Guid>( 'courseId' );
        const nineKey = cxt.params.get<Guid>( 'nineKey' );

        const course = await this.loadCourse( courseId );
        const found = this.findNine( course, nineKey );
        const foundIndex = course.nines.findIndex( nine => nine.key === found.key );

        const designCount = await new db.Query<Design>( Design.kind )
            .equal( 'courseId', courseId )
            .equal( 'nineKey', nineKey )
            .count();

        if( designCount > 0 ) {
            throw new ApplicationError( ERROR_CODES.NINE_DELETING_WITH_DESIGNS, `golf: invalid nine deletion; related designs must be deleted first` );
        }

        course.nines.splice( foundIndex, 1 );
        this.updateAuditInfo( cxt, course );
        return course.save();
    }

    @web.attr.post( '/:courseId/photo' )
    @web.attr.middleware( FileRouter.multer.any() )
    @web.attr.argument( 'courseId', value => is.guid( value ) )
    @attr.group( GroupType.User )
    public static async onUploadPhoto( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const courseId = cxt.params.get<Guid>( 'courseId' );
        const course = await this.loadCourse( courseId );

        const count = await new db.Query<File>( File.kind )
            .equal( 'ownerId', course.id )
            .equal( 'createUserId', cxt.user.id )
            .count();

        if( count + 1 > COURSE_PHOTO_LIMIT ) {
            throw new ApplicationError( ERROR_CODES.COURSE_PHOTO_LIMIT_EXCEEDED, `golf: only ${COURSE_PHOTO_LIMIT} photos are allowed per course per user` );
        }

        cxt.params.body.ownerId = course.id;
        cxt.params.body.ownerKind = course.kind;
        cxt.params.body.storage = FileStorage.Aws;

        const created = await FileRouter.onCreate( cxt );
        course.files.push( created );

        return course;
    }

    @web.attr.put( '/:courseId/updatePublishedDesignsCount' )
    @web.attr.argument( 'courseId', value => is.guid( value ) )
    @attr.group( GroupType.User )
    public static async onUpdatePublishedDesignsCount( cxt: Context ): Promise<Course> {
        await this.assertNotReadonlyUser( cxt );

        const courseId = cxt.params.get<Guid>( 'courseId' );
        const course = await this.loadCourse( courseId );

        // get all usable, published designs for the given course
        const designs = await new db.Query<Design>( Design.kind )
            .equal( 'courseId', course.id )
            .equal( 'state', DesignState.Published )
            .notEqual( 'hidden', true )
            .notEqual( 'disabled', true )
            .select();

        // count each design against its owning nine
        const counts: Record<Guid, number> = {};
        designs.forEach( design => {
            counts[design.nineKey] = ( counts[design.nineKey] || 0 ) + 1;
        } );

        // apply the count above to the indicated nine (or mark as zero)
        course.nines.forEach( nine => {
            nine.publishedDesignsCount = ( counts[nine.key] || 0 );
        } );

        return course.save();
    }
}
