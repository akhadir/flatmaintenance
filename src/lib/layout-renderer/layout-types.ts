export type LayoutType = {
    key?: string;
    type: string;
    id?: string;
    name?: string;
    children?: LayoutType[];
    config?: any;
};

export type LayoutProps = {
    layout: LayoutType;
};
