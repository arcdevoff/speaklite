import Topics from '@/components/screens/Topics';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME + ' - Темы диалогов',
};

const TopicsPage = () => {
  return <Topics />;
};

export default TopicsPage;
