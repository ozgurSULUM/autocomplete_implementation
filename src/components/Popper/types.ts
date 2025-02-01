import type { ReactNode, RefObject } from 'react';

export interface PopperInterface {
    open: boolean;
    children: ReactNode;
    id: string;
    anchorRef: RefObject<HTMLElement>
}