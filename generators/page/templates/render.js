import React from 'react';<% if (useOkta) { %>
import { Button } from '../../common';<% } %>

function <%= pageRenderName %>(props) {<% if (useOkta) { %>
  const { userInfo, authService } = props;<% } %>
  return (
    <div><% if (useOkta) { %>
      <h1>Hi {userInfo.name}, this is an example of using Okta User info.</h1><% } %>
      <div>
        <p>
          This is an example of a common page component.
        </p><% if (useOkta) { %>
        <p>
          <Button
            handleClick={() => authService.logout()}
            buttonText="Logout"
          />
        </p><% } %>
      </div>
    </div>
  );
}
export default <%= pageRenderName %>;
