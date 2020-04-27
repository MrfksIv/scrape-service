import { Profile } from '../entities';
import { InMemoryDataStore } from '../data-store';

export function saveProfilesToStore(profiles: Profile[]): void {
    const dataStoreInstance = InMemoryDataStore.getInstance();
    dataStoreInstance.clearStore();

    profiles.forEach((profile) => {
        dataStoreInstance.insertProfile(profile);
    });
}
