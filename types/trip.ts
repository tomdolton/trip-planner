interface Trip {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    isPublic: boolean;
    isArchived: boolean;
    isDeleted: boolean;
}
