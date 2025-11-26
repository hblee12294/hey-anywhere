import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  shift,
  useRole,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { enableLongPressStorage } from "@/utils/storage";

interface PopupProps {
  onPopupOpen?: (element: HTMLElement) => void;
}

const LONG_PRESS_DURATION = 500;
const MOVEMENT_THRESHOLD = 5;

export const Popup = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & PopupProps
>(({ children, onPopupOpen }, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ["left-start"],
      }),
      shift({ padding: 10 }),
    ],
    placement: "top",
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);

  const { getFloatingProps, getItemProps } = useInteractions([dismiss]);

  const [enableLongPress, setEnableLongPress] = useState(true);

  useEffect(() => {
    enableLongPressStorage.getValue().then(setEnableLongPress);
    return enableLongPressStorage.watch(setEnableLongPress);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let startX = 0;
    let startY = 0;

    function onMouseDown(e: MouseEvent) {
      if (!enableLongPress) return;
      if (e.button !== 0) return;

      const target = e.target as HTMLElement;

      if (refs.floating.current?.contains(target as Element | null)) {
        return;
      }

      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        startX = e.clientX;
        startY = e.clientY;

        timer = setTimeout(() => {
          onPopupOpen?.(target);

          refs.setPositionReference({
            getBoundingClientRect() {
              return {
                width: 0,
                height: 0,
                x: e.clientX,
                y: e.clientY,
                top: e.clientY,
                right: e.clientX,
                bottom: e.clientY,
                left: e.clientX,
              };
            },
          });

          setIsOpen(true);
          timer = null;
        }, LONG_PRESS_DURATION);
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (timer) {
        const diffX = Math.abs(e.clientX - startX);
        const diffY = Math.abs(e.clientY - startY);

        if (diffX > MOVEMENT_THRESHOLD || diffY > MOVEMENT_THRESHOLD) {
          clearTimeout(timer);
          timer = null;
        }
      }
    }

    function onMouseUp() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (timer) clearTimeout(timer);
    };
  }, [refs, onPopupOpen, enableLongPress]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingFocusManager context={context} disabled={true}>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 1000,
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
          >
            {Children.map(
              children,
              (child) =>
                isValidElement(child) && cloneElement(child, getItemProps())
            )}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});
