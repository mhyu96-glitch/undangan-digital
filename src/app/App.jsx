import BabyInvitation from '../../BabyInvitation.jsx';
import BuilderPage from '../builder/BuilderPage.jsx';
import BestMixInvitation from '../templates/BestMixInvitation.jsx';
import TemplateShowcase from '../templates/TemplateShowcase.jsx';
import { getActiveInvitationConfig } from '../services/configMerge.js';

const normalizePath = (pathname) => {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
};

export default function App() {
  const path = normalizePath(window.location.pathname);
  const config = getActiveInvitationConfig();

  if (path === '/builder') {
    return <BuilderPage />;
  }

  if (path === '/templates') {
    return <TemplateShowcase />;
  }

  if (config.template === 'best-mix') {
    return <BestMixInvitation config={config} />;
  }

  return <BabyInvitation />;
}
