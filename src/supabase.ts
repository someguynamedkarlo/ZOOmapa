const fetchData = async (filters: { pay?: number; type?: number[] }) => {
  try {
    const response = await fetch("/BAZA2.json");
    const data = await response.json();

    // Apply filters to the data
    let filteredData = data;

    if (filters.pay !== undefined) {
      filteredData = filteredData.filter(
        (item: any) => item.Pay === filters.pay
      );
    }

    if (filters.type && filters.type.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        filters.type?.includes(item.Type)
      );
    }

    return filteredData;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
};

export default fetchData;
