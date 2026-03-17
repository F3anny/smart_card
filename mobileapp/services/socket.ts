import { SocketEvents } from '@/types';
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private url: string = '';

    connect(url: string) {
        if (this.socket?.connected) return this.socket;

        this.url = url;
        this.socket = io(url, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data?: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
        if (this.socket) {
            this.socket.on(event as string, callback as any);
        }
    }

    off(event: string, callback?: Function) {
        if (this.socket) {
            this.socket.off(event, callback as any);
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export default new SocketService();
