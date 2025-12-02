import * as iconsRegular from '@fortawesome/pro-regular-svg-icons';
import * as iconsBrands from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { IconName, IconPkg } from './Icon.types';

// "@fortawesome/free-brands-svg-icons": "^6.5.1",
// "@fortawesome/pro-duotone-svg-icons": "^6.5.1",
// "@fortawesome/pro-regular-svg-icons": "^6.5.1",
// "@fortawesome/pro-solid-svg-icons": "^6.5.1",
// "@fortawesome/pro-light-svg-icons": "^6.5.1",
// "@fortawesome/pro-thin-svg-icons": "^6.5.1",

const globals = {
    defaultPkg: 'regular' as IconPkg,
    registry: new Map<IconPkg, Record<IconName, Any>>(),
};

export function forceIconDefinition(
    options: {
        path: string;
        height: number;
        width: number;
    }
): IconDefinition {
    const {
        path,
        height,
        width,
    } = options;

    return {
        icon: [
            width,
            height,
            null,
            null,
            path,
        ],
        iconName: 'foo',
        prefix: 'foo',
    } as Ignore;
}

export function getDefaultIconPkg(): IconPkg {
    return globals.defaultPkg;
}

export function setDefaultIconPkg( value: IconPkg ) {
    globals.defaultPkg = value;
}

export function hasIconPkg( iconPkg: IconPkg ): boolean {
    return globals.registry.has( iconPkg );
}

export function getIconDefinition( iconPkg: IconPkg, iconName: IconName ): IconDefinition {
    return (
        globals.registry.get( iconPkg )?.[iconName] ||
        globals.registry.get( 'regular' ).faSquareQuestion
    );
}

export function registerIconPkg( iconPkg: IconPkg, pkgIcons: Any ) {
    const {
        far,
        fad,
        fab,
        fas,
        fal,
        fat,
        prefix,
        ...pkgRest
    } = pkgIcons;

    globals.registry.set( iconPkg, pkgRest );
}

registerIconPkg( 'regular', iconsRegular );
registerIconPkg( 'brands', iconsBrands );
