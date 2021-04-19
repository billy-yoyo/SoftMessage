import { User } from "../../common/models/user";
import { UserRow } from "../db/tables/sm_user";

export default (userRow: UserRow): User => {
    return new User(
        userRow.user_id,
        userRow.user_name,
        userRow.is_online
    );
};
