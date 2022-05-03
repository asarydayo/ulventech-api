export function CountryMapper(data) {
  return {
    id: data.uuid,
    name: data.country_name,
    code: data.country_code,

    value: data.uuid,
    label: `${data.country_name} - ${data.country_code}`,
  };
}

export function CountrySelectMapper(data) {
  return {
    value: data.uuid,
    label: `${data.country_name} - ${data.country_code}`,
    name: data.country_name,
  };
}
