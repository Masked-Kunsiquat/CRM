import { RecordModel } from "pocketbase";

/**
 * The type of contact group currently active.
 * - "internal" refers to coworkers.
 * - "external" refers to clients/contacts.
 * - "all" fetches both internal and external.
 */
export type ActiveTab = "internal" | "external" | "all";

/**
 * Entity types that can have associated contacts
 */
export type EntityType = "organization" | "account" | "subaccount";

/**
 * Options used to fetch contacts related to an entity.
 */
export interface UseContactsOptions {
  activeTab: ActiveTab;
  entityType: EntityType;
  entityId: string;
  expand?: string; // Optional field expansion
}

/**
 * Function signature for fetching contacts from a PocketBase collection
 */
export type FetchContactsFn = (
  collection: string,
  entityType: EntityType,
  entityId: string,
  expand?: string,
) => Promise<RecordModel[]>;

/**
 * Function signature for retrieving contacts data outside of React Query
 */
export type GetContactsDataFn = (
  options: UseContactsOptions
) => Promise<RecordModel[]>;

export type ContactsCardProps = {
    context: "organization" | "account" | "subaccount";
    organizationId: string;
    accountId?: string;
    subaccountId?: string;
    isHomeCompany?: boolean;
  };
