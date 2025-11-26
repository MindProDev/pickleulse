// Icon wrapper using Phosphor Icons for modern stroke-based iconography
// Phosphor provides consistent, scalable icons with multiple weight options

import {
  CaretRight,
  ChartBar,
  Clock,
  Code,
  Fire,
  Gear,
  House,
  Lock,
  PaperPlaneTilt,
  TennisBall,
  Users
} from 'phosphor-react-native';
import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

// Map SF Symbol names to Phosphor icon components
const ICON_MAPPING = {
  'house.fill': House,
  'paperplane.fill': PaperPlaneTilt,
  'chevron.left.forwardslash.chevron.right': Code,
  'chevron.right': CaretRight,
  'clock.fill': Clock,
  'gearshape.fill': Gear,
  'chart.bar.fill': ChartBar,
  'sportscourt.fill': TennisBall,
  'flame.fill': Fire,
  'lock.fill': Lock,
  'figure.pickleball': TennisBall,
  'person.2.fill': Users,
} as const;

type IconSymbolName = keyof typeof ICON_MAPPING;

/**
 * An icon component that uses Phosphor Icons for a modern, stroke-based aesthetic.
 * Provides consistent iconography across all platforms with customizable weights.
 * Icon `name`s are based on SF Symbols for backward compatibility.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'fill',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}) {
  const IconComponent = ICON_MAPPING[name];
  return <IconComponent size={size} color={color as string} weight={weight} style={style} />;
}
