import { environment } from "src/environments/environment";

const API_ROOT = 'environment.apiUrl' + '/api'
export const API_PATH = {
  cauSieuVoVi: {
    root: `${API_ROOT}/cau-sieu-vo-vi`
  },
  kinh: {
    root: `${API_ROOT}/kinh`
  },
}

export const API_PARAMS = {
  caodaionLibrady: {
    user: 'caodaion-library',
    repo: 'caodaion-library.github.io'
  }
}
