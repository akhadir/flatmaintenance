export type LayoutType = {
    key?: string;
    type: string;
    id?: string;
    name?: string;
    children?: LayoutType[];
};

export type LayoutProps = {
    layout: LayoutType;
};
