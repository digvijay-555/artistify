import TokenSection from '@/components/portfolio/TokenSection';
import UserInformation from '@/components/portfolio/UserInformation';
import { getUserByAddress } from '@/lib/actions/user.actions';

export default async function PortfolioPage({ params }: { params: { address: string } }) {
  const { address } = params;
  // console.log('PortfolioPage address:', address);

  // Fetch the user data server-side
  const user = await getUserByAddress(address);

  if (!user) {
    return <div>
      User not found <span>{address}</span></div>;
  }

  return (
    <>
      <UserInformation user={user} />
      <TokenSection />
    </>
  );
}
