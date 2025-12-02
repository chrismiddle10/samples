import { color, is } from '../../shared';

export class PaletteScale {
    private _lightest: string = null;
    private _lighter: string = null;
    private _light: string = null;
    private _base: string = null;
    private _dark: string = null;
    private _darker: string = null;
    private _darkest: string = null;

    public static readonly White = new PaletteScale( '#ffffff' );
    public static readonly Black = new PaletteScale( '#000000' );

    public constructor( value: string ) {
        if( is.not.color( value.startsWith( '#' ) ? value.slice( 1 ) : value ) ) {
            throw ArgumentError.Required( 'value', 'must be a valid hex color' );
        }

        this._base = value.toLowerCase();
    }

    public get lightest(): string {
        if( this._lightest ) {
            return this._lightest;
        }

        this._lightest = this.generateToken( 'tint', 0.75 );
        return this._lightest;
    }

    public get lighter(): string {
        if( this._lighter ) {
            return this._lighter;
        }

        this._lighter = this.generateToken( 'tint', 0.50 );
        return this._lighter;
    }

    public get light(): string {
        if( this._light ) {
            return this._light;
        }

        this._light = this.generateToken( 'tint', 0.25 );
        return this._light;
    }

    public get base(): string {
        return this._base;
    }

    public get dark(): string {
        if( this._dark ) {
            return this._dark;
        }

        this._dark = this.generateToken( 'shade', 0.75 );
        return this._dark;
    }

    public get darker(): string {
        if( this._darker ) {
            return this._darker;
        }

        this._darker = this.generateToken( 'shade', 0.50 );
        return this._darker;
    }

    public get darkest(): string {
        if( this._darkest ) {
            return this._darkest;
        }

        this._darkest = this.generateToken( 'shade', 0.25 );
        return this._darkest;
    }

    public toString(): string {
        return this.base;
    }

    private generateToken( method: 'shade' | 'tint', factor: number ): string {
        const asRGB = color.convert.to( this._base );

        switch( method ) {
            case 'shade':
                return color.convert.from( color.palette.shade( asRGB, factor ) );
            case 'tint':
                return color.convert.from( color.palette.tint( asRGB, factor ) );
            default:
                throw new Error( 'invalid method' );
        }
    }
}