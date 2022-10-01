export type LayoutType = {
    key?: string;
    type: string;
    compType?: string;
    id?: string;
    name?: string;
    children?: LayoutType[];
    config?: any;
    parent?: LayoutType;
    showAs?: string;
    noShow?: boolean;
};

export type LayoutProps = {
    layout: LayoutType;
};
