"use client";

import { Fragment } from "react";
import type { ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  footer?: ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  showCloseButton = true,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  footer,
}: ModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "relative w-full transform rounded-xl bg-white text-left align-middle shadow-2xl transition-all max-h-[90vh] flex flex-col",
                  sizeClasses[size],
                  className
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex-1">
                      {title && (
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-500">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex items-center justify-between p-6 border-t border-gray-200 flex-shrink-0">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// Modal Header component for more complex layouts
export function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {children}
    </div>
  );
}

// Modal Title component
export function ModalTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Title className={cn("text-2xl font-bold text-gray-900", className)}>
      {children}
    </Dialog.Title>
  );
}

// Modal Description component
export function ModalDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Description className={cn("text-sm text-gray-500 mt-1", className)}>
      {children}
    </Dialog.Description>
  );
}

// Modal Close Button component
export function ModalCloseButton({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        "p-2 hover:bg-gray-100 rounded-full transition-colors duration-200",
        className
      )}
      aria-label="Close"
    >
      <X className="w-5 h-5 text-gray-500" />
    </button>
  );
}

// Modal Footer component for action buttons
export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 pt-6 border-t border-gray-200", className)}>
      {children}
    </div>
  );
}