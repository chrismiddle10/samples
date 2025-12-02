import styled, { css } from 'styled-components/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Pressable from '../Pressable';
import { IconTransients } from './Icon.types';

export const IconMixins = {
    Root: {
        Size: {
            xs: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.xs};
                `}
            `,
            sm: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.xs};
                `}
            `,
            md: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.xs};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.xs};
                `}
            `,
            lg: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.sm};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.sm};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.sm};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.sm};
                `}
            `,
            xl: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.md};
                `}
            `,
            xxl: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.md};
                `}
            `,
            xxxl: css<IconTransients>`
                ${props => ( props.$spacing === 'both' || props.$spacing === 'left' ) && css`
                    margin-left: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'both' || props.$spacing === 'right' ) && css`
                    margin-right: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'top' ) && css`
                    margin-top: ${props => props.theme.token.spacing.md};
                `}
                ${props => ( props.$spacing === 'bottom' ) && css`
                    margin-bottom: ${props => props.theme.token.spacing.md};
                `}
            `,
        },

        Variant: {
            default: css``,
            primary: css``,
            secondary: css``,
            tertiary: css``,
            success: css``,
            input: css``,
            danger: css``,
            warning: css``,
            plain: css``,
            navbar: css``,
        },
    },
};

export const IconElements = {
    Root: styled( FontAwesomeIcon )<IconTransients>`
        ${props => props.theme.collection.default.mixin.base}
        ${props => props.$interactive && props.theme.collection.default.mixin?.focused}
        ${props => props.$interactive && props.theme.collection.default.mixin?.hovered}
        ${props => props.$interactive && props.theme.collection.default.mixin?.pressed}
        ${props => props.theme.collection.default.mixin.disabled}

        ${props => props.theme.collection[props.$variant]?.mixin?.base}
        ${props => props.$interactive && props.theme.collection[props.$variant]?.mixin?.focused}
        ${props => props.$interactive && props.theme.collection[props.$variant]?.mixin?.hovered}
        ${props => props.$interactive && props.theme.collection[props.$variant]?.mixin?.pressed}
        ${props => props.theme.collection[props.$variant]?.mixin?.disabled}

        background-color: transparent;
        border-radius: 0px;
        border-width: 0px;
        outline-style: none;

        ${props => typeof props.$size !== 'number' && IconMixins.Root.Size[props.$size]}
        ${props => props.theme.component.Icon?.Root}
    `,

    // REMARK: 2024-06-24: THIS IS INTENTIONALLY NOT OVERRIDABLE OR STYLEABLE
    Pressable: styled( Pressable )<IconTransients>`
        align-items: center;
        background-color: transparent;
        border: 1px solid transparent;
        display: flex;
        justify-content: center;

        ${props => PLATFORM.WEB && props.$interactive && css`
            cursor: pointer;
        `}
    `,
};
