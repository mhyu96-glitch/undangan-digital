import { useEffect, useMemo, useState } from 'react';
import BabyInvitation from '../../BabyInvitation.jsx';
import BuilderPage from '../builder/BuilderPage.jsx';
import BestMixInvitation from '../templates/BestMixInvitation.jsx';
import TemplateShowcase from '../templates/TemplateShowcase.jsx';
import { getActiveInvitationConfig, mergeConfig } from '../services/configMerge.js';
import defaultInvitationConfig from '../config/defaultInvitationConfig.js';

const normalizePath = (pathname) => {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
};

export default function App() {
  const path = normalizePath(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const forceInvite = params.get('mode') === 'invite';
  const forceStandaloneInvite = Boolean(window.__INVITATION_STANDALONE__);
  const waitsForMessageConfig = params.get('source') === 'message';
  const initialConfig = useMemo(() => getActiveInvitationConfig(), []);
  const [messageConfig, setMessageConfig] = useState(null);
  const config = messageConfig ? mergeConfig(defaultInvitationConfig, messageConfig) : initialConfig;

  useEffect(() => {
    if (!waitsForMessageConfig) return undefined;

    const handleMessage = (event) => {
      if (event.data?.type === 'INVITATION_CONFIG' && event.data.config) {
        setMessageConfig(event.data.config);
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent?.postMessage({ type: 'REQUEST_INVITATION_CONFIG' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, [waitsForMessageConfig]);

  const renderInvitation = () => {
    if (config.template === 'best-mix') {
      return <BestMixInvitation config={config} />;
    }

    return <BabyInvitation config={config} />;
  };

  if (forceStandaloneInvite || forceInvite || path === '/invite' || path === '/undangan') {
    return renderInvitation();
  }

  if (path === '/' || path === '/builder') {
    return <BuilderPage />;
  }

  if (path === '/templates') {
    return <TemplateShowcase />;
  }

  return <BuilderPage />;
}
