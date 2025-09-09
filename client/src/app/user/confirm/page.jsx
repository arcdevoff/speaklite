import UserConfirm from '@/components/screens/User/Confirm';
import { UserService } from '@/services/user.service';
import { redirect } from 'next/navigation';

const UserConfirmPage = async ({ searchParams }) => {
  return <UserConfirm token={searchParams.token} />;
};

export default UserConfirmPage;
