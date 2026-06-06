const KEY = "rentbasket_addresses";

export const getAddresses = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const saveAddresses = (addresses) =>
  localStorage.setItem(KEY, JSON.stringify(addresses));

export const addAddress = (address) => {
  const list = getAddresses();
  const newEntry = { ...address, id: crypto.randomUUID() };
  if (address.isDefault || list.length === 0) {
    newEntry.isDefault = true;
    list.forEach((a) => (a.isDefault = false));
  }
  saveAddresses([...list, newEntry]);
  return newEntry;
};

export const updateAddress = (id, updates) => {
  let list = getAddresses();
  if (updates.isDefault) list.forEach((a) => (a.isDefault = false));
  list = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveAddresses(list);
};

export const deleteAddress = (id) => {
  let list = getAddresses().filter((a) => a.id !== id);
  if (list.length > 0 && !list.some((a) => a.isDefault)) {
    list[0].isDefault = true;
  }
  saveAddresses(list);
};
