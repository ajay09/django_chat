export interface Server {
    id: number;
    name: string;
    banner: string;
    description: string;
    icon: string;
    category: string[];
    owner: number;
    channel_server: {
        id: number;
        name: string;
        server: number;
        topic: string;
        owner: number;
    }[];
}