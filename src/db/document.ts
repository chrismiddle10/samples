/**
 * This is an example of how database documents are defined within the system using inheritance and decorators.
 */
import { db } from '@piasastudios/core/server';
import { FileOwner } from '@piasastudios/rogue/server/db';
import { Coordinate } from './Coordinate';
import { Nine } from './Nine';
import { Alert } from './Alert';
import { CourseType } from '../../shared';

@db.attr.document( 'Golf-Course' )
@db.attr.skipRelations( 'createUser', 'updateUser' )    // << skips automatically loading these relationships which are defined on db.Base
export class Course extends FileOwner {    // << inheritance is fully supported. this actually looks like Course < FileOwner < db.Base < Doc
    @db.attr.required.field.string()
    @db.attr.ui( { label: 'Name' } )
    public name: string;

    @db.attr.field( 'Golf-CourseType', () => CourseType.Golf )    // << this provides a default value of CourseType.Golf when no value is provided.
    @db.attr.ui( { label: 'Type' } )
    public type: CourseType;

    @db.attr.required.field( 'Golf-Coordinate' )    // << Golf-Coordinate is not a document but a type within the schema system; i.e. it is simply lat/lng data and does not contain ID, audit info, etc
    @db.attr.ui( { label: 'Coordinate' } )
    public coordinate: Coordinate;

    @db.attr.field.string()
    @db.attr.ui( { label: 'Place ID' } )
    public placeId: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'Address 1' } )
    public address1: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'Address 2' } )
    public address2: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'City' } )
    public city: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'State' } )
    public state: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'County' } )
    public county: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'Country' } )
    public country: string;

    @db.attr.field.string()
    @db.attr.ui( { label: 'Postal Code' } )
    public postalCode: string;

    @db.attr.array( 'Golf-Nine', 'new-array' )    // << this tells the system to initialize with an empty array when no value is provided.
    public nines: Nine[];

    @db.attr.array( 'Golf-Alert', 'new-array' )
    public alerts: Alert[];
}
