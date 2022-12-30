export interface VehicleData {
  status: Status
  metadata: Metadata
  items: ViolationItem[]
  code: string
  msg: string
  type: number
}

export interface ViolationItem {
  crossingName: string
  longitude: string
  latitude: string
  crossing: Crossing
  laneName: string
  directionName: string
  lane: Lane
  plateTypeName: string
  passTime: string
  plateColorName: string
  vehicleColorName: string
  vehicleTypeName: string
  vehicleColorDepthName: string
  vehicleLogoName: string
  vehicleSubLogoName: string
  vehicleModelName: string
  violativeActionName: string
  tfsId: string | null
  hasThumb: string | null
  plateImagePath: string
  imagePath: string
  imagePath2: string | null
  imagePath3: string | null
  imagePath4: string | null
  imagePath5: string | null
  imagePath6: string | null
  imagePath7: string | null
  vehicleLampName: string | null
  frontChildName: string | null
  pilotSunvisorName: string
  vicePilotSunvisorName: string
  sunroof: string | null
  sunroofName: string | null
  pdvsName: string | null
  usePhoneName: string
  vicePilotSafebeltName: string
  pendantName: string
  labelName: string | null
  tissueBoxName: string | null
  decorationName: string | null
  dangMarkName: string
  envproSignName: string
  vehicleSignName: string | null
  tempPlateNoName: string | null
  vehicleRect: string | null
  driverPosition: string | null
  viceDriverPosition: string | null
  platePosition: string | null
  sunroofPosition: string | null
  copilot: string | null
  copilotName: string | null
  linkFaceVehicleId: string | null
  checkResult: string | null
  sequenceId: string | null
  plateBelong: string | null
  plateBelongName: string | null
  picUrlNum: string | null
  dataSources: string | null
  vehicleState: string | null
  vehicleStateName: string | null
  area: string | null
  cascade: string
  areaCode: string
  pilotSafebelt: string
  pilotSafebeltName: string
  multiVehicle: string
  recognitionSign: string
  plateNoSimilarity: string | null
  mobileDeviceLatitude: string | null
  vehicleHead: string
  vehicleHeadName: string
  vehicleInfoLevel: string | null
  storageTime: string | null
  subFeature: string | null
  videoStructure: string | null
  vehicleisSlave: string | null
  plateTail: string | null
  plateProvince: string | null
  plateCheckResult: string | null
  plateState: string | null
  plateStateName: string | null
  mobileDeviceLongitude: string | null
  linkVehicleRfidId: string | null
  rfidArchivesDTO: string | null
  cameraIndexCode: string
  plateDiff: string | null
  linkVehicleMacId: string | null
  rowKey: string | null
  luggageRack: string | null
  luggageRackName: string | null
  vehicleSprayPainted: string | null
  vehicleSprayPaintedName: string | null
  spareTire: string | null
  spareTireName: string | null
  card: string | null
  cardName: string | null
  cardTypeName: string | null
  muckTruck: string | null
  muckTruckName: string | null
  coverPlate: string | null
  coverPlateName: string | null
  tricycleCanopy: string | null
  tricycleCanopyName: string | null
  pilot: string | null
  alarmId: string | null
  alarmType: string
  alarmTypeName: string | null
  violativeCompany: string | null
  violativeCompanyName: string | null
  alarmProcess: string | null
  alarmProcessResult: string | null
  alarmPlanInfo: string | null
  alarmUserName: string | null
  vModelX: string | null
  vvModelY: string | null
  vModelW: string | null
  vModelH: string | null
  licenseBright: string | null
  illegalTrafficEvent: string | null
  ecolabel: string | null
  cardNum: string | null
  cardType: string | null
  pdvsPosition: string | null
  cardPosition: string | null
  decorationPosition: string | null
  tissueBoxPosition: string | null
  pendantPosition: string | null
  smallChar: string
  passId: string
  crossingId: number
  crossingIndexCode: string
  laneNo: string
  directionIndex: string
  plateNo: string
  plateType: string
  vehicleSpeed: number
  vehicleLen: number
  plateColor: string
  vehicleColor: string
  vehicleType: string
  vehicleColorDepth: string
  vehicleLogo: string
  vehicleSubLogo: string
  vehicleModel: string
  violativeAction: string
  facePicUrl: string | null
  vehicleLamp: string | null
  frontChild: string | null
  pilotSunvisor: string
  vicePilotSunvisor: string
  pdvs: string | null
  uphone: string
  vicePilotSafebelt: string
  pendant: string
  label: string | null
  labelNum: string | null
  tissueBox: string | null
  decoration: string | null
  dangMark: string
  envproSign: string
  vehicleSign: string | null
  tempPlateNo: string | null
}

export interface Crossing {
  crossingId: string
  indexCode: string
  name: string
  orgIndexCode: string
  longitude: string
  latitude: string
}

export interface Lane {
  crossingIndexCode: string
  laneNo: string
  laneName: string
  laneIndexCode: string
  directNo: string
  laneId: string | null
  cameraIndexCode: string
}

export interface Metadata {
  creationTimestamp: string
  labels: Labels
  pageNo: number
  pageSize: number
  totalCount: number
  consume: number
  totalPage: number
}

export interface Labels {
  timeConsume: string
  numOfMatches: string
  totalMatches: string
}

export interface Status {
  code: string
  message: string
  label: string
  prompt: string
  successful: boolean
}
