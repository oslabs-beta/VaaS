export default async function Post(
  url: string,
  body: Record<string, unknown>
): Promise<any> {
  try {
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (err: any) {
    throw new Error(err);
  }
}
