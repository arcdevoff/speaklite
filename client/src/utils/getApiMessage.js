export default function getApiMessage(response) {
  if (response?.data) {
    let status;
    const data = response.data;

    if (response.status === 200) {
      status = true;
    } else {
      status = false;
    }

    if (data.message) {
      return { text: data.message, status };
    }
  }

  return false;
}
