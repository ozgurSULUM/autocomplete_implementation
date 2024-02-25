interface PopperInterface {
    open: boolean;
    children: React.ReactNode;
    id: string;
    anchorRef: React.RefObject<HTMLElement>
}