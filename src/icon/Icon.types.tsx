import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import * as iconsRegular from '@fortawesome/pro-regular-svg-icons';
import * as iconsBrands from '@fortawesome/free-brands-svg-icons';
import { IconMixins, IconElements } from './Icon.styled';
import { AnyStyle } from '../util';

const { far, prefix: prefixRegular, ...restRegular } = iconsRegular;
const { fab, prefix: prefixBrands, ...restBrands } = iconsBrands;

/**
 * {IconPkg} defines supported icon packages.
 * It is important to note that only 2 packages are installed by default: "regular" and "brands".
 * All other packages must be installed and registered before using them.
 */
export type IconPkg = (
    // base installs
    'regular' |
    'brands' |

    // extra installs
    'duotone' |
    'light' |
    'solid' |
    'thin'
);

export type IconName = keyof typeof restRegular | keyof typeof restBrands;
export type IconSize = keyof typeof IconMixins.Root.Size;
export type IconVariant = keyof typeof IconMixins.Root.Variant;

export interface IconProps {
    /**
     * IconProps#color
     */
    color?: string;

    /**
     * IconProps#definition
     */
    definition?: IconDefinition;

    /**
     * IconProps#duotoneColor
     */
    duotoneColor?: string;

    /**
     * IconProps#duotoneOpacity
     */
    duotoneOpacity?: number;

    /**
     * IconProps#disabled
     */
    disabled?: boolean;

    /**
     * IconProps#boolean
     */
    hidden?: boolean;

    /**
     * IconProps#name
     */
    name?: IconName;

    /**
     * IconProps#pkg
     */
    pkg?: IconPkg;

    /**
     * IconProps#rotate
     */
    rotate?: number;

    /**
     * IconProps#size
     */
    size?: IconSize | number;

    /**
     * IconProps#spacing
     */
    spacing?: 'both' | 'none' | Position;

    /**
     * IconProps#spin
     */
    spin?: boolean;

    /**
     * IconProps#style
     */
    style?: AnyStyle | {
        [key in keyof typeof IconElements]?: AnyStyle;
    };

    /**
     * IconProps#variant
     */
    variant?: IconVariant;

    /**
     * IconProps#onPress
     */
    onPress?: () => void;
}

export interface IconTransients {
    $disabled?: boolean;
    $focused?: boolean;
    $hovered?: boolean;
    $spacing?: IconProps['spacing'];
    $interactive?: boolean;
    $pressed?: boolean;

    $color?: string;
    $duotoneColor?: string;
    $duotoneOpacity?: number;

    $pkg?: IconPkg;
    $size?: IconSize | number;
    $variant?: IconVariant;
}
