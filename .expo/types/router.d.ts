/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/addDept` | `/addDept`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/addLocal` | `/addLocal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/dashboard` | `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/adminlogin` | `/adminlogin`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/login` | `/login`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/signup` | `/signup`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/success` | `/success`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/homed` | `/homed`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/map` | `/map`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/profiled` | `/profiled`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/Styles/shome` | `/Styles/shome`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/importResident` | `/importResident`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/map` | `/map`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/users` | `/users`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Styles/homestyle` | `/Styles/homestyle`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyResult` | `/survey/SurveyResult`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(admin)'}/addDept` | `/addDept`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(admin)'}/addLocal` | `/addLocal`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(admin)'}/dashboard` | `/dashboard`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(login)'}/adminlogin` | `/adminlogin`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(login)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(login)'}/login` | `/login`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(login)'}/signup` | `/signup`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(login)'}/success` | `/success`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/homed` | `/homed`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/map` | `/map`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/profiled` | `/profiled`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/Styles/shome` | `/Styles/shome`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabd)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/home` | `/home`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/importResident` | `/importResident`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/map` | `/map`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/users` | `/users`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Styles/homestyle` | `/Styles/homestyle`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyResult` | `/survey/SurveyResult`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(admin)'}/addDept${`?${string}` | `#${string}` | ''}` | `/addDept${`?${string}` | `#${string}` | ''}` | `${'/(admin)'}/addLocal${`?${string}` | `#${string}` | ''}` | `/addLocal${`?${string}` | `#${string}` | ''}` | `${'/(admin)'}/dashboard${`?${string}` | `#${string}` | ''}` | `/dashboard${`?${string}` | `#${string}` | ''}` | `${'/(login)'}/adminlogin${`?${string}` | `#${string}` | ''}` | `/adminlogin${`?${string}` | `#${string}` | ''}` | `${'/(login)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(login)'}/login${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `${'/(login)'}/signup${`?${string}` | `#${string}` | ''}` | `/signup${`?${string}` | `#${string}` | ''}` | `${'/(login)'}/success${`?${string}` | `#${string}` | ''}` | `/success${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/homed${`?${string}` | `#${string}` | ''}` | `/homed${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/HouseDetails${`?${string}` | `#${string}` | ''}` | `/HouseDetails${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/map${`?${string}` | `#${string}` | ''}` | `/map${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/profiled${`?${string}` | `#${string}` | ''}` | `/profiled${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/weatherscreen${`?${string}` | `#${string}` | ''}` | `/weatherscreen${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/Styles/shome${`?${string}` | `#${string}` | ''}` | `/Styles/shome${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/survey/NewSurvey${`?${string}` | `#${string}` | ''}` | `/survey/NewSurvey${`?${string}` | `#${string}` | ''}` | `${'/(tabd)'}/survey/SurveyList${`?${string}` | `#${string}` | ''}` | `/survey/SurveyList${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/home${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/HouseDetails${`?${string}` | `#${string}` | ''}` | `/HouseDetails${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/importResident${`?${string}` | `#${string}` | ''}` | `/importResident${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/map${`?${string}` | `#${string}` | ''}` | `/map${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/profile${`?${string}` | `#${string}` | ''}` | `/profile${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/users${`?${string}` | `#${string}` | ''}` | `/users${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/weatherscreen${`?${string}` | `#${string}` | ''}` | `/weatherscreen${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Styles/homestyle${`?${string}` | `#${string}` | ''}` | `/Styles/homestyle${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/survey/NewSurvey${`?${string}` | `#${string}` | ''}` | `/survey/NewSurvey${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/survey/SurveyList${`?${string}` | `#${string}` | ''}` | `/survey/SurveyList${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/survey/SurveyResult${`?${string}` | `#${string}` | ''}` | `/survey/SurveyResult${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/addDept` | `/addDept`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/addLocal` | `/addLocal`; params?: Router.UnknownInputParams; } | { pathname: `${'/(admin)'}/dashboard` | `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/adminlogin` | `/adminlogin`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/login` | `/login`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/signup` | `/signup`; params?: Router.UnknownInputParams; } | { pathname: `${'/(login)'}/success` | `/success`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/homed` | `/homed`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/map` | `/map`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/profiled` | `/profiled`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/Styles/shome` | `/Styles/shome`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabd)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/HouseDetails` | `/HouseDetails`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/importResident` | `/importResident`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/map` | `/map`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/users` | `/users`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/weatherscreen` | `/weatherscreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Styles/homestyle` | `/Styles/homestyle`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/NewSurvey` | `/survey/NewSurvey`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyList` | `/survey/SurveyList`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/survey/SurveyResult` | `/survey/SurveyResult`; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}
