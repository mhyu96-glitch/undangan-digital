import defaultInvitationConfig from '../config/defaultInvitationConfig.js';
import { loadBuilderDraft } from './configStorage.js';

export const cloneConfig = (config) => JSON.parse(JSON.stringify(config));

export const mergeConfig = (base, override) => {
  if (!override || typeof override !== 'object') return cloneConfig(base);

  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.entries(override).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      output[key] = mergeConfig(base[key], value);
      return;
    }

    output[key] = value;
  });

  return output;
};

export const getActiveInvitationConfig = () => {
  if (typeof window === 'undefined') return cloneConfig(defaultInvitationConfig);
  return mergeConfig(defaultInvitationConfig, loadBuilderDraft());
};
