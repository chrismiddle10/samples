import { db } from '@piasastudios/core/server';
import { FileOwner } from '@piasastudios/rogue/server/db';
import { Coordinate } from './Coordinate';
import { Nine } from './Nine';
import { Alert } from './Alert';
import { CourseType } from '../../shared';

@db.attr.document( 'Golf-Course' )
@db.attr.skipRelations( 'createUser', 'updateUser' )
export class Course extends FileOwner {
    @db.attr.required.field.string()
    @db.attr.ui( { label: 'Name' } )
    public name: string;

    @db.attr.field( 'Golf-CourseType', () => CourseType.Golf )
    @db.attr.ui( { label: 'Type' } )
    public type: CourseType;

    @db.attr.required.field( 'Golf-Coordinate' )
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

    @db.attr.array( 'Golf-Nine', 'new-array' )
    public nines: Nine[];

    @db.attr.array( 'Golf-Alert', 'new-array' )
    public alerts: Alert[];
}
