import { setAccessToken, setUserData, setUserDataRefresh } from '@/redux/reducers/user/slice';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useUser = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const { data, userDataRefresh, accessToken } = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const getProfile = useCallback(() => {
    setIsLoading(true);

    UserService.getProfile()
      .then(({ data }) => {
        dispatch(setUserData(data));
        dispatch(setUserDataRefresh(false));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const logout = async () => {
    const res = await AuthService.logout();

    if (res.status === 200) {
      dispatch(setAccessToken(''));
      dispatch(setUserData(''));
      router.push('/');
      router.refresh('/');
    }
  };

  React.useEffect(() => {
    if (pathname !== `/user/confirm`) {
      getProfile();
    }
  }, [getProfile]);

  React.useEffect(() => {
    if (userDataRefresh) {
      getProfile();
    }
  }, [userDataRefresh, getProfile]);

  return { user: data || null, isLoading: isLoading, logout };
};

export default useUser;
