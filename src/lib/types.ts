export type BlogPost = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    date: string;
    tags: string;
};

export type ContactMessage = {
    id: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
    isRead: boolean;
};
