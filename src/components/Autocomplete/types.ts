import type { ReactNode, DetailedHTMLProps, HTMLAttributes} from 'react';

export interface AutocompleteCommonProps<T> {
    options?: T[]
    renderOption?: (option: T, isSelected: boolean, props: RenderOptionProps)=>ReactNode
    inputValue?: string;
    onInputValueChange?: (value: string) => void;
    isOptionEqualToValue?: (option: T, value: T | null) => boolean; 
    getOptionLabel?: (option: T) => string;
    onClose?: ()=>void
    keyboardActionsThrottle?: number;
    isLoading?: boolean;
    isEmpty?: boolean;
    isUninitialized?: boolean;
    inputId?: string;
}

export type AutocompleteMultipleTrueProps<T> = {
    multiple: true;
    value: T[]
    renderTags?: (values: T[]) => ReactNode;
    onChange?: (values: T[])=>void
}

export type AutocompleteMultipleFalseProps<T> =  {
    multiple?: false;
    value: T | null;
    renderTags?: (values: T[]) => ReactNode;
    onChange?: (value: T | null)=>void
}

export type RenderOptionProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> & { "data-selected": boolean };

export type AutocompleteProps<T> = AutocompleteCommonProps<T> & (AutocompleteMultipleTrueProps<T> | AutocompleteMultipleFalseProps<T>) ;

