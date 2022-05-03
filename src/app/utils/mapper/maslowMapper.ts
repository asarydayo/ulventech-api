export function MaslowMapper(data) {
  return {
    id: data.uuid,
    name: data.maslow_name,
    color: data.maslow_code,
    text: data.maslow_text,

    value: data.uuid,
    label: `${data.maslow_name} - ${data.maslow_text}`,
  };
}

export function MaslowSelectMapper(data) {
  return {
    value: data.uuid,
    label: `${data.maslow_name} - ${data.maslow_text}`,
  };
}
