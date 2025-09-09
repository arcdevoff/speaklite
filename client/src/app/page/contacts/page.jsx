export const metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME + ' - Контакты',
};

const ContactsPage = () => {
  return (
    <div>
      <h1 className="title">Контакты</h1>
      <div style={{ textAlign: 'center' }}>
        <b>Электронная почта: speakliteofficial@gmail.com</b>
        <br />
        <b>Телефон: +79602500211</b>
      </div>
    </div>
  );
};

export default ContactsPage;
