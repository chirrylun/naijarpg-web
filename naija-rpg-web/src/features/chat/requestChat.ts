import { api, errorText } from '@/lib/api';
import { useToast } from '@/stores/toast';

export async function requestChat(username: string) {
  try {
    await api('/api/chat/requests', { body: { username } });
    useToast.getState().push(`Chat request sent to ${username}`, 'good');
  } catch (e) {
    useToast.getState().push(errorText(e), 'bad');
  }
}