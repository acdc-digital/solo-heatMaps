import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile: (githubProfile, tokens) => {
        return {
          id: githubProfile.id.toString(),
          name: githubProfile.name,
          email: githubProfile.email,
          image:
            typeof githubProfile.avatar_url === "string"
              ? githubProfile.avatar_url
              : null,
          githubId: githubProfile.id,
        };
      }
    })
  ],
});
