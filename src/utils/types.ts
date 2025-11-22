export interface newLink {
    targetUrl: string;
    id: string;
    updatedAt: Date;
    totalClicks: number;
    createdAt?: Date | undefined;
    deletedAt?: Date | null | undefined;
    lastClickedAt?: Date | null | undefined;
}

export interface LinkResponse {
    id: string;
    targetUrl: string;
    linkCode: string | null;
    totalClicks: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    lastClickedAt: Date | null;
}
