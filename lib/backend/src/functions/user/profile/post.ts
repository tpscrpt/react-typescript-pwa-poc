import { Tested } from "../../../types/helpers";
import { ApiGatewayPlainSuccessResponse, ApiGatewayEvent, ApiGatewayResponse } from "../../../types/aws";
import { decodeBody } from "../../../utils/decode-body";
import { requireOnePropertyPassesInPartial } from "../../../utils/body-validation";
import { errorHelper } from "../../../utils/error-helper";
import { plainSuccess } from "../../../utils/plain-success";
import { UserProfile } from "../../../types/business";

type UserProfilePostBody = Partial<UserProfile>;

const userProfileTests: Tested<UserProfile> = {};

export async function handler(event: ApiGatewayEvent): Promise<ApiGatewayResponse<ApiGatewayPlainSuccessResponse>> {
  try {
    const userProfilePostBody = decodeBody<UserProfilePostBody>(event.body);
    requireOnePropertyPassesInPartial<UserProfile>(userProfilePostBody, userProfileTests);
    // check auth
    // write to db
    return plainSuccess;
  } catch (e) {
    return errorHelper(e);
  }
}
