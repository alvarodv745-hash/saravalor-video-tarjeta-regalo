import { Composition } from "remotion";
import { STORY_FRAMES, VIDEO } from "./constants";
import { GiftCardStory } from "./GiftCardStory";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GiftCardStory"
        component={GiftCardStory}
        durationInFrames={STORY_FRAMES}
        {...VIDEO}
        defaultProps={{ showSafeZones: false }}
      />
      <Composition
        id="GiftCardStoryGuides"
        component={GiftCardStory}
        durationInFrames={STORY_FRAMES}
        {...VIDEO}
        defaultProps={{ showSafeZones: true }}
      />
    </>
  );
};
