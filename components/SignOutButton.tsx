import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <div>
      <form action="/auth/signout" method="post">
        <Button variant="ghost" type="submit">
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </form>
    </div>
  );
}
