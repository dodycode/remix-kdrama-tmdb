import { api } from "~/utils/api.server";

const baseURL = "https://api.themoviedb.org/3";

export const discoverTVShows = async (
  page: number = 1,
  token: string,
  sortBy: string
) => {
  if (!token) throw new Error("No token provided");

  const dateNextMonthFromNow = new Date();
  dateNextMonthFromNow.setMonth(dateNextMonthFromNow.getMonth() + 1);
  //set the date to the last day of the first week of the next month
  dateNextMonthFromNow.setDate(7);
  const dateNextMonthFromNowString = dateNextMonthFromNow
    .toISOString()
    .split("T")[0];

  let APIUrl = `${baseURL}/discover/tv?air_date.lte=${dateNextMonthFromNowString}&with_genres=18|10759|80|35|9648|10765|10768&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_origin_country=KR`;
  if (sortBy === "popularity.asc" || sortBy === "vote_average.asc") {
    //less popular
    //make sure the shows already aired
    const today = new Date().toISOString().split("T")[0];
    APIUrl = `${baseURL}/discover/tv?first_air_date.lte=${today}&with_genres=18|10759|80|35|9648|10765|10768&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_origin_country=KR`;
  }

  if (sortBy === "popularity.desc" || sortBy === "vote_average.desc") {
    //most popular
    //make sure vote_count is greater than 1000
    APIUrl = `${baseURL}/discover/tv?vote_count.gte=99&with_genres=18|10759|80|35|9648|10765|10768&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&with_origin_country=KR`;
  }

  const response = await api(APIUrl, "GET", token);

  return response;
};
