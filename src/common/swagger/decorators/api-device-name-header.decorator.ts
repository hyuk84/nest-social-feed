import { ApiHeader } from '@nestjs/swagger';

export function ApiDeviceNameHeader() {
  return ApiHeader({
    name: 'x-device-name',
    required: false,
    description: 'Device name used for this session (optional)',
  });
}
