import { RouteType } from "@multiversx/sdk-dapp/types";

export const routeNames = {
    home: "/",
    dashboard: "/dashboard",
    statistics: "/statistics",
    unlock: "/unlock",
    claimRewards: "/claimRewards"
  };

  interface RouteWithTitleType extends RouteType {
    title: string;
  }
  
  export const routes: RouteWithTitleType[] = [
    {
      path: routeNames.home,
      title: "Home",
      component: null,
    },
    {
      path: routeNames.dashboard,
      title: "Index",
      component: null,
      authenticatedRoute: true,
    },
    {
      path: routeNames.statistics,
      title: "Statistics",
      component: null,
      authenticatedRoute: true,
    },
    {
      path:routeNames.claimRewards,
      title: "Claim Rewards",
      component: null,
      authenticatedRoute: true
    }
  ];