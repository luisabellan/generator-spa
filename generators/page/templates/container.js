import React, { useState, useEffect, useMemo } from 'react';
<% if (useOkta) { %>import { useOktaAuth } from '@okta/okta-react';<% } %>

import <%= pageRenderName%> from './<%= pageRenderName%>';

function <%= pageContainerName %>({ LoadingComponent }) {
  <% if (useOkta) { %>const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);<% } %>

  useEffect(() => {<% if (useOkta) { %>
    let isSubscribed = true;
    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);<% } %>
  }, [<%= useOkta ? 'memoAuthService' : '' %>]);

  return (
    <><% if (useOkta) { %>
      {authState.isAuthenticated && !userInfo && (
        <LoadingComponent message="Fetching user profile..." />
      )}
      {authState.isAuthenticated && userInfo && (
        <RenderHomePage userInfo={userInfo} authService={authService} />
      )}<% } else { %>
        <<%= pageRenderName %> /><% } %>
    </>
  );
}

export default <%= pageContainerName %>;
