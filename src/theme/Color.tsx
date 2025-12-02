import { is } from '../../shared';

export class Color {
    public static readonly REGEX_RGB = /^rgb\([ ]*\d+[ ]*\,[ ]*\d+[ ]*\,[ ]*\d+[ ]*\)$/;
    public static readonly REGEX_RGBA = /^rgba\([ ]*\d+[ ]*\,[ ]*\d+[ ]*\,[ ]*\d+[ ]*\,[ ]*\d*\.?\d+[ ]*\)$/;
    public static readonly REGEX_HEX = /^#[A-Fa-f0-9]{6}$/;
    public static readonly REGEX_HEXA = /^#[A-Fa-f0-9]{8}$/;

    public static readonly Black = new Color( 0, 0, 0 );
    public static readonly White = new Color( 255, 255, 255 );

    public static parse( colorString: string ): Color {
        let r: number;
        let g: number;
        let b: number;
        let a: number;

        if( Color.REGEX_RGB.test( colorString ) ) {
            const temp = colorString.replace( / /g, '' ).slice( 4, -1 ).split( ',' );
            r = parseInt( temp[0] );
            g = parseInt( temp[1] );
            b = parseInt( temp[2] );
            a = 1.0;
        } else if( Color.REGEX_RGBA.test( colorString ) ) {
            const temp = colorString.replace( / /g, '' ).slice( 5, -1 ).split( ',' );
            r = parseInt( temp[0] );
            g = parseInt( temp[1] );
            b = parseInt( temp[2] );
            a = parseInt( temp[3] );
        } else if( Color.REGEX_HEX.test( colorString ) ) {
            const temp = colorString.slice( 1 ).toLowerCase();
            r = parseInt( Number( `0x${temp.substring( 0, 2 )}` ).toString( 10 ) );
            g = parseInt( Number( `0x${temp.substring( 2, 4 )}` ).toString( 10 ) );
            b = parseInt( Number( `0x${temp.substring( 4, 6 )}` ).toString( 10 ) );
            a = 1.0;
        } else if( Color.REGEX_HEXA.test( colorString ) ) {
            const temp = colorString.slice( 1 ).toLowerCase();
            r = parseInt( Number( `0x${temp.substring( 0, 2 )}` ).toString( 10 ) );
            g = parseInt( Number( `0x${temp.substring( 2, 4 )}` ).toString( 10 ) );
            b = parseInt( Number( `0x${temp.substring( 4, 6 )}` ).toString( 10 ) );
            a = parseFloat( ( parseInt( Number( `0x${temp.substring( 6, 8 )}` ).toString( 10 ) ) / 256 ).toFixed( 2 ) );
        } else {
            throw new Error( 'invalid format' );
        }

        if( isNaN( r ) ) {
            throw new Error( 'invalid red value' );
        }

        if( isNaN( g ) ) {
            throw new Error( 'invalid green value' );
        }

        if( isNaN( b ) ) {
            throw new Error( 'invalid blue value' );
        }

        if( is.defined( a ) && isNaN( a ) ) {
            throw new Error( 'invalid alpha value' );
        }

        a = a > 1.0 ? 1.0 : a;
        a = a < 0.0 ? 0.0 : a;

        return new Color( r, g, b, a );
    }

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    public constructor( r: number, g: number, b: number, a: number = 1.0 ) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public get r(): number {
        return this._r;
    }

    public get g(): number {
        return this._g;
    }

    public get b(): number {
        return this._b;
    }

    public get a(): number {
        return this._a;
    }

    public set r( value: number ) {
        if( is.not.between.inclusive( value, 0, 255 ) ) {
            throw new Error( `color: invalid red value {${value}}` );
        }

        this._r = value;
    }

    public set g( value: number ) {
        if( is.not.between.inclusive( value, 0, 255 ) ) {
            throw new Error( `color: invalid green value {${value}}` );
        }

        this._g = value;
    }

    public set b( value: number ) {
        if( is.not.between.inclusive( value, 0, 255 ) ) {
            throw new Error( `color: invalid blue value {${value}}` );
        }

        this._b = value;
    }

    public set a( value: number ) {
        if( is.not.between.inclusive( value, 0, 1 ) ) {
            throw new Error( `color: invalid alpha value {${value}}` );
        }

        this._a = value;
    }

    public copy(): Color {
        const copy = new Color(
            this.r,
            this.g,
            this.b,
            this.a,
        );

        return copy;
    }

    public set( options: { r?: number; g?: number; b?: number; a?: number } ): Color {
        if( is.number( options.r ) ) {
            this._r = options.r;
        }

        if( is.number( options.g ) ) {
            this._g = options.g;
        }

        if( is.number( options.b ) ) {
            this._b = options.b;
        }

        if( is.number( options.a ) ) {
            this._a = options.a;
        }

        return this;
    }

    public toRGB() {
        return `rgb( ${this.r}, ${this.g}, ${this.b} )`;
    }

    public toRGBA() {
        return `rgba( ${this.r}, ${this.g}, ${this.b}, ${this.a} )`;
    }

    public toHex() {
        const rHex = this.r.toString( 16 ).padStart( 2, '0' );
        const gHex = this.g.toString( 16 ).padStart( 2, '0' );
        const bHex = this.b.toString( 16 ).padStart( 2, '0' );

        return `#${rHex}${gHex}${bHex}`;
    }

    public toHexAlpha() {
        const aHex = ( 256 * this.a ).toString( 16 ).padStart( 2, '0' );

        return this.toHex() + aHex;
    }

    public adjustAlpha( offset: number ): Color {
        this._a += offset;
        return this;
    }
}
