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

interface PopupProps {
  onPopupOpen?: (element: HTMLElement) => void;
}

export const Popup = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & PopupProps
>(({ children, onPopupOpen }, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
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

  useEffect(() => {
    function onMouseUp(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (refs.floating.current?.contains(target as Element | null)) {
        return;
      }

      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
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
      }
    }

    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [refs]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingFocusManager context={context} disabled={true}>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 1000 }}
            {...getFloatingProps()}
          >
            {Children.map(
              children,
              (child) =>
                isValidElement(child) &&
                cloneElement(
                  child,
                  getItemProps()
                )
            )}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
});
