import { client } from './client.js'
import { toast } from 'react-toastify';
export async function getName(apiKey) {
     const { data: dataUser } = await client.get('/users/profile', null, apiKey);
     if (dataUser.code === 200) {
          document.cookie = `userName=${dataUser.data.emailId.name}`;
     }
     return dataUser;
}
export async function getEmailApi(email, setLoading) {
     setLoading(true)
     if (email) {
          let url = new URLSearchParams({ email });
          const { data } = await client.get(`/api-key?${url}`);
          if (data.code === 200) {
               const apiKey = data.data.apiKey;
               document.cookie = `apiKey=${apiKey}`;
               getName(apiKey)
          } else {
               toast.error("Email không tồn tại trong hệ thống!");
          }
          setLoading(false)
          return data;
     } else {
          toast.error("vui lòng nhập email!")
     }
     setLoading(false)
}