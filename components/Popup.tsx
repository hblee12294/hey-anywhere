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
  FloatingOverlay,
} from "@floating-ui/react";

export const Popup = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>(({ children }, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);

  const allowMouseUpCloseRef = useRef(false);

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
    placement: "right-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: "menu" });
  const dismiss = useDismiss(context);

  const { getFloatingProps, getItemProps } = useInteractions([role, dismiss]);

  useEffect(() => {
    let timeout: number;

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();

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
      clearTimeout(timeout);

      allowMouseUpCloseRef.current = false;
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true;
      }, 300);
    }

    function onMouseUp() {
      if (allowMouseUpCloseRef.current) {
        setIsOpen(false);
      }
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("mouseup", onMouseUp);
      clearTimeout(timeout);
    };
  }, [refs]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingOverlay lockScroll>
          <FloatingFocusManager context={context} initialFocus={refs.floating}>
            <div
              className="ContextMenu"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {Children.map(
                children,
                (child) =>
                  isValidElement(child) &&
                  cloneElement(
                    child,
                    getItemProps({
                      //   onClick() {
                      //     child.props.onClick?.();
                      //     setIsOpen(false);
                      //   },
                      //   onMouseUp() {
                      //     child.props.onClick?.();
                      //     setIsOpen(false);
                      //   },
                    })
                  )
              )}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
});
